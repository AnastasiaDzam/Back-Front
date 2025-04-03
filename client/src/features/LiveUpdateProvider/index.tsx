import type { UserType } from '@/entities/user';
import { useAppSelector } from '@/shared/hooks/reduxHooks';
import React, {
  useReducer,
  useEffect,
  useRef,
  createContext,
  useContext,
  type ReactNode,
} from 'react';

type State = {
  users: UserType[];
};

type Action = { type: 'SET_USERS_FROM_SERVER'; payload: UserType[] };

type LiveUpdateContextType = {
  users: UserType[];
};

const usersReducer = (state: State, action: Action): State => {
  if (action.type === 'SET_USERS_FROM_SERVER') {
    return { ...state, users: action.payload };
  }
  return state;
};

const LiveUpdateContext = createContext<LiveUpdateContextType | undefined>(undefined);

export const LiveUpdateProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [state, dispatch] = useReducer(usersReducer, { users: [] });
  const { user } = useAppSelector((stateRedux) => stateRedux.user);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:3000');
    const socket = socketRef.current;

    socket.onmessage = (event: MessageEvent<unknown>) => {
      try {
        if (typeof event.data !== 'string') {
          throw new Error('Неверный формат данных в сообщении WebSocket.');
        }

        const parsedData: unknown = JSON.parse(event.data);

        if (
          typeof parsedData === 'object' &&
          parsedData !== null &&
          'type' in parsedData &&
          'payload' in parsedData &&
          parsedData.type === 'SET_USERS_FROM_SERVER' &&
          Array.isArray(parsedData.payload)
        ) {
          const { type, payload } = parsedData as {
            type: 'SET_USERS_FROM_SERVER';
            payload: UserType[];
          };

          dispatch({ type, payload });
        } else {
          throw new Error('Получены некорректные данные.');
        }
      } catch (error) {
        console.error('Ошибка обработки сообщения WebSocket:', error);
      }
    };

    return () => {
      socket.close();
    };
  }, [user]);

  return (
    <LiveUpdateContext.Provider value={{ users: state.users }}>
      {children}
    </LiveUpdateContext.Provider>
  );
};

export const useLiveUpdate = (): LiveUpdateContextType => {
  const context = useContext(LiveUpdateContext);

  if (context === undefined) {
    throw new Error('useLiveUpdateContext нужно использовать внутри LiveUpdateProvider');
  }

  return context;
};

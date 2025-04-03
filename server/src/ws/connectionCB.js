
const map = new Map();

const connectionCb = (socket, request, userFromJWT) => {

  map.set(userFromJWT.id, { ws: socket, user: userFromJWT });

  map.forEach(({ ws }) => {
    ws.send(
      JSON.stringify({
        type: 'SET_USERS_FROM_SERVER',
        payload: [...map.values()].map(({ user }) => user),
      })
    );
  });


  socket.on('error', (err) => {
    console.log(err);
  });

  socket.on('close', () => {
    map.delete(userFromJWT.id);

    map.forEach(({ ws }) => {
      ws.send(
        JSON.stringify({
          type: 'SET_USERS_FROM_SERVER',
          payload: [...map.values()].map(({ user }) => user),
        })
      );
    });
  });
};

module.exports = connectionCb;

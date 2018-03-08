import pino from 'pino';

const l = pino({
  name: "myapp",
  level: 50,
});

export default l;

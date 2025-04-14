import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { studentController } from './controller';
import cors from '@elysiajs/cors';

const app = new Elysia({
  
  serve: {
    idleTimeout: 255,
  }
});

// app.use(staticPlugin({
//   assets: 'public',
//   prefix: '/',
// }));
app.use(cors())

studentController(app);

// app.get('/', () => {
//   return new Response(null, {
//     status: 302,
//     headers: {
//       Location: '/dashboard.html',
//     },
//   });
// });

app.listen(3001);
console.log('🚀 Server đang chạy tại http://localhost:3001');
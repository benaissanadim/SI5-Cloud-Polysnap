import { registerAs } from '@nestjs/config';

export default registerAs('dependencies', () => ({
  user_service_url: process.env.USER_SERVICE_URL,
}));

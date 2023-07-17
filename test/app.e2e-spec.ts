import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { SignupDto } from '../src/auth/dto';
describe('App e2e', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    describe('Signup', () => {
      const dto: SignupDto = {
        username: 'ali',
        password: '12345',
        number: 112,
      };
      it('should throw if email or number is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            username: dto.username,
            password: dto.password,
          })
          .expectStatus(400)
          .inspect();
      });
      it('should signup',() => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
      it('should throw 409 for duplicate',() => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(409)
          .inspect();
      });
    });
    describe('Login',() => {
      it.todo('should signin');
    });
  });
  describe('Property', () => {
    describe('Get Properties', () => {});
    describe('Post Property', () => {});
    describe('Update Property', () => {});
    describe('Delete Property', () => {});
  });
  describe('ticket', () => {
    describe('Post Ticket', () => {});
  });
});

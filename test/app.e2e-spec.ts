import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { LoginDto, SignupDto } from '../src/auth/dto';
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
        number: '9388322310',
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
    describe('Login', () => {
      const dto: LoginDto = {
        number: '9388322310',
        code: 1,
      };
      it('should ask for otp code', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ number: dto.number })
          .expectStatus(201)
          .inspect()
          .stores('otp_code', 'otp_code');

        //console.log(a)
      });
      it('invalid otp code', () =>{
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ number: dto.number, code: dto.code })
          .expectStatus(401)
          .inspect();
      });
      it('not found number', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ number: '9388322311', code: dto.code })
          .expectStatus(404)
          .inspect();
      });
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ number: dto.number, code: '$S{otp_code}' })
          .expectStatus(201)
          .inspect();
      });
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

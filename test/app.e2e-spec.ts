import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { LoginDto, SignupDto } from '../src/auth/dto';
describe('App e2e', () => {
  const user = {
    username: 'ali',
    password: '12345',
    number: '9388322310',
  };
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
      const dto: SignupDto = user;
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
      it('invalid otp code', () => {
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
          .stores('token', 'access_token')
          .expectStatus(201)
          .inspect();
      });
    });
  });
  describe('Property', () => {
    describe('Post Property', () => {
      it('should post a property', () => {
        return pactum
          .spec()
          .post('/properties')
          .withBody({ name: 'home', location: 'ahvaz', size: '50m' })
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(201)
          .inspect();
      });
    });
    describe('Get Properties', () => {
      it('should get all properties', () => {
        return pactum
          .spec()
          .get('/properties')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(200)
          .inspect();
      });
      it('should get properties with specific size ', () => {
        return pactum
          .spec()
          .get('/properties')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withQueryParams({
            size: '50m',
            location: 'ahvaz',
            name: 'home',
          })
          .expectStatus(200)
          .inspect();
      });

    });
    describe('Update Property', () => {
      it('should update a property name', () => {
        return pactum
          .spec()
          .patch('/properties/1')
          .withBody({ name: 'home1' })
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(200)
          .inspect();
      });
      it('should update a property size', () => {
        return pactum
          .spec()
          .patch('/properties/1')
          .withBody({ size: '12m' })
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(200)
          .inspect();
      });
      it('should update a property location', () => {
        return pactum
          .spec()
          .patch('/properties/1')
          .withBody({ location: 'tehran' })
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(200)
          .inspect();
      });
    });
    describe('Delete Property', () => {
      it('should delete a property', () => {
        return pactum
          .spec()
          .delete('/properties/1')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(200)
          .inspect();
      });
    });
  });
  describe('ticket', () => {
    describe('Post Ticket', () => {
      it('should post a ticket', () => {
        return pactum
          .spec()
          .post('/ticket')
          .withBody({ subject: 'test subject', body: 'test body' })
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(201)
          .inspect();
      });
    });
  });
});

const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../src/index');

describe('Events API', () => {
  let eventId;
  let authToken;

  before(async () => {
    // Sign in user and get token
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PASSWORD,
    });
    
    if (error) throw error;
    authToken = session.access_token;
  });

  describe('POST /api/events', () => {
    it('should create a new event', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Event',
          description: 'Test Description',
          date: new Date().toISOString(),
          capacity: 100,
          price: 29.99
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      eventId = res.body.id;
    });
  });

  describe('GET /api/events', () => {
    it('should return all events', async () => {
      const res = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('GET /api/events/:id', () => {
    it('should return a single event', async () => {
      const res = await request(app)
        .get(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id', eventId);
    });
  });
});
/* eslint-disable
    max-len,
    no-return-assign,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const SandboxedModule = require('sandboxed-module')
const { expect } = require('chai')
const sinon = require('sinon')
const MockResponse = require('../../../../../test/unit/src/helpers/MockResponse')
const modulePath = require('path').join(
  __dirname,
  '../../../app/src/LaunchpadController.js'
)

describe('LaunchpadController', function () {
  beforeEach(function () {
    this.user = {
      _id: '323123',
      first_name: 'fn',
      last_name: 'ln',
      save: sinon.stub().callsArgWith(0),
    }

    this.User = {}
    this.LaunchpadController = SandboxedModule.require(modulePath, {
      requires: {
        '@overleaf/settings': (this.Settings = {
          adminPrivilegeAvailable: true,
        }),
        '@overleaf/metrics': (this.Metrics = {}),
        '../../../../app/src/Features/User/UserRegistrationHandler':
          (this.UserRegistrationHandler = {
            promises: {},
          }),
        '../../../../app/src/Features/Email/EmailHandler': (this.EmailHandler =
          { promises: {} }),
        '../../../../app/src/Features/User/UserGetter': (this.UserGetter = {
          promises: {},
        }),
        '../../../../app/src/models/User': { User: this.User },
        '../../../../app/src/Features/Authentication/AuthenticationController':
          (this.AuthenticationController = {}),
        '../../../../app/src/Features/Authentication/AuthenticationManager':
          (this.AuthenticationManager = {}),
        '../../../../app/src/Features/Authentication/SessionManager':
          (this.SessionManager = {}),
      },
    })

    this.email = 'bob@smith.com'

    this.req = {
      query: {},
      body: {},
      session: {},
    }

    this.res = new MockResponse()
    this.res.locals = {
      translate(key) {
        return key
      },
    }
  })

  describe('launchpadPage', function () {
    beforeEach(function () {
      this._atLeastOneAdminExists = sinon.stub(
        this.LaunchpadController,
        '_atLeastOneAdminExists'
      )
      return (this.AuthenticationController.setRedirectInSession = sinon.stub())
    })

    afterEach(function () {
      return this._atLeastOneAdminExists.restore()
    })

    describe('when the user is not logged in', function () {
      beforeEach(function () {
        this.SessionManager.getSessionUser = sinon.stub().returns(null)
      })

      describe('when there are no admins', function () {
        beforeEach(function (done) {
          this._atLeastOneAdminExists.resolves(false)
          this.res.callback = done
          this.next = sinon.stub().callsFake(() => done())
          return this.LaunchpadController.launchpadPage(
            this.req,
            this.res,
            this.next
          )
        })

        it('should render the launchpad page', function () {
          const viewPath = require('path').join(
            __dirname,
            '../../../app/views/launchpad'
          )
          this.res.render.callCount.should.equal(1)
          return this.res.render
            .calledWith(viewPath, {
              adminUserExists: false,
              authMethod: 'local',
            })
            .should.equal(true)
        })
      })

      describe('when there is at least one admin', function () {
        beforeEach(function (done) {
          this._atLeastOneAdminExists.resolves(true)
          this.res.callback = done
          this.next = sinon.stub().callsFake(() => done())
          return this.LaunchpadController.launchpadPage(
            this.req,
            this.res,
            this.next
          )
        })

        it('should redirect to login page', function () {
          this.AuthenticationController.setRedirectInSession.callCount.should.equal(
            1
          )
          this.res.redirect.calledWith('/login').should.equal(true)
        })

        it('should not render the launchpad page', function () {
          return this.res.render.callCount.should.equal(0)
        })
      })
    })

    describe('when the user is logged in', function () {
      beforeEach(function () {
        this.user = {
          _id: 'abcd',
          email: 'abcd@example.com',
        }
        this.SessionManager.getSessionUser = sinon.stub().returns(this.user)
        this._atLeastOneAdminExists.resolves(true)
      })

      describe('when the user is an admin', function () {
        beforeEach(function (done) {
          this.UserGetter.promises.getUser = sinon
            .stub()
            .resolves({ isAdmin: true })
          this.res.callback = done
          this.next = sinon.stub().callsFake(() => done())
          return this.LaunchpadController.launchpadPage(
            this.req,
            this.res,
            this.next
          )
        })

        it('should render the launchpad page', function () {
          const viewPath = require('path').join(
            __dirname,
            '../../../app/views/launchpad'
          )
          this.res.render.callCount.should.equal(1)
          return this.res.render
            .calledWith(viewPath, {
              wsUrl: undefined,
              adminUserExists: true,
              authMethod: 'local',
            })
            .should.equal(true)
        })
      })

      describe('when the user is not an admin', function () {
        beforeEach(function (done) {
          this.UserGetter.promises.getUser = sinon
            .stub()
            .resolves({ isAdmin: false })
          this.res.callback = done
          this.next = sinon.stub().callsFake(() => done())
          return this.LaunchpadController.launchpadPage(
            this.req,
            this.res,
            this.next
          )
        })

        it('should redirect to restricted page', function () {
          this.res.redirect.callCount.should.equal(1)
          return this.res.redirect.calledWith('/restricted').should.equal(true)
        })
      })
    })
  })

  describe('_atLeastOneAdminExists', function () {
    describe('when there are no admins', function () {
      beforeEach(function () {
        return (this.UserGetter.promises.getUser = sinon.stub().resolves(null))
      })

      it('should callback with false', async function () {
        const exists = await this.LaunchpadController._atLeastOneAdminExists()
        expect(exists).to.equal(false)
      })
    })

    describe('when there are some admins', function () {
      beforeEach(function () {
        return (this.UserGetter.promises.getUser = sinon
          .stub()
          .resolves({ _id: 'abcd' }))
      })

      it('should callback with true', async function () {
        const exists = await this.LaunchpadController._atLeastOneAdminExists()
        expect(exists).to.equal(true)
      })
    })

    describe('when getUser produces an error', function () {
      beforeEach(function () {
        return (this.UserGetter.promises.getUser = sinon
          .stub()
          .rejects(new Error('woops')))
      })

      it('should produce an error', async function () {
        await expect(this.LaunchpadController._atLeastOneAdminExists()).rejected
      })
    })
  })

  describe('sendTestEmail', function () {
    beforeEach(function () {
      this.EmailHandler.promises.sendEmail = sinon.stub().resolves()
      this.req.body.email = 'someone@example.com'
      return (this.next = sinon.stub())
    })

    it('should produce a 200 response', function (done) {
      this.res.callback = () => {
        this.res.json.calledWith({ message: 'email_sent' }).should.equal(true)
        done()
      }
      this.LaunchpadController.sendTestEmail(this.req, this.res, this.next)
    })

    it('should not call next with an error', function () {
      this.LaunchpadController.sendTestEmail(this.req, this.res, this.next)
      return this.next.callCount.should.equal(0)
    })

    it('should have called sendEmail', function () {
      this.LaunchpadController.sendTestEmail(this.req, this.res, this.next)
      this.EmailHandler.promises.sendEmail.callCount.should.equal(1)
      return this.EmailHandler.promises.sendEmail
        .calledWith('testEmail')
        .should.equal(true)
    })

    describe('when sendEmail produces an error', function () {
      beforeEach(function () {
        return (this.EmailHandler.promises.sendEmail = sinon
          .stub()
          .rejects(new Error('woops')))
      })

      it('should call next with an error', function (done) {
        this.next = sinon.stub().callsFake(err => {
          expect(err).to.be.instanceof(Error)
          this.next.callCount.should.equal(1)
          done()
        })
        this.LaunchpadController.sendTestEmail(this.req, this.res, this.next)
      })
    })

    describe('when no email address is supplied', function () {
      beforeEach(function () {
        return (this.req.body.email = undefined)
      })

      it('should produce a 400 response', function () {
        this.LaunchpadController.sendTestEmail(this.req, this.res, this.next)
        this.res.status.calledWith(400).should.equal(true)
        this.res.json
          .calledWith({
            message: 'no email address supplied',
          })
          .should.equal(true)
      })
    })
  })

  describe('registerAdmin', function () {
    beforeEach(function () {
      return (this._atLeastOneAdminExists = sinon.stub(
        this.LaunchpadController,
        '_atLeastOneAdminExists'
      ))
    })

    afterEach(function () {
      return this._atLeastOneAdminExists.restore()
    })

    describe('when all goes well', function () {
      beforeEach(function (done) {
        this._atLeastOneAdminExists.resolves(false)
        this.email = 'someone@example.com'
        this.password = 'a_really_bad_password'
        this.req.body.email = this.email
        this.req.body.password = this.password
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon
          .stub()
          .resolves(this.user)
        this.User.updateOne = sinon
          .stub()
          .returns({ exec: sinon.stub().resolves() })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.AuthenticationManager.validateEmail = sinon.stub().returns(null)
        this.AuthenticationManager.validatePassword = sinon.stub().returns(null)
        this.next = sinon.stub().callsFake(() => done())
        this.res.callback = done
        return this.LaunchpadController.registerAdmin(
          this.req,
          this.res,
          this.next
        )
      })

      it('should send back a json response', function () {
        this.res.json.callCount.should.equal(1)
        expect(this.res.json).to.have.been.calledWith({ redir: '/launchpad' })
      })

      it('should have checked for existing admins', function () {
        return this._atLeastOneAdminExists.callCount.should.equal(1)
      })

      it('should have called registerNewUser', function () {
        this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          1
        )
        return this.UserRegistrationHandler.promises.registerNewUser
          .calledWith({ email: this.email, password: this.password })
          .should.equal(true)
      })

      it('should have updated the user to make them an admin', function () {
        this.User.updateOne.callCount.should.equal(1)
        return this.User.updateOne
          .calledWithMatch(
            { _id: this.user._id },
            {
              $set: {
                isAdmin: true,
                emails: [{ email: this.user.email }],
              },
            }
          )
          .should.equal(true)
      })
    })

    describe('when no email is supplied', function () {
      beforeEach(function () {
        this._atLeastOneAdminExists.resolves(false)
        this.email = undefined
        this.password = 'a_really_bad_password'
        this.req.body.email = this.email
        this.req.body.password = this.password
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon.stub()
        this.User.updateOne = sinon.stub().returns({ exec: sinon.stub() })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.next = sinon.stub()
        return this.LaunchpadController.registerAdmin(
          this.req,
          this.res,
          this.next
        )
      })

      it('should send a 400 response', function () {
        this.res.sendStatus.callCount.should.equal(1)
        return this.res.sendStatus.calledWith(400).should.equal(true)
      })

      it('should not check for existing admins', function () {
        return this._atLeastOneAdminExists.callCount.should.equal(0)
      })

      it('should not call registerNewUser', function () {
        return this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          0
        )
      })
    })

    describe('when no password is supplied', function () {
      beforeEach(function () {
        this._atLeastOneAdminExists.resolves(false)
        this.email = 'someone@example.com'
        this.password = undefined
        this.req.body.email = this.email
        this.req.body.password = this.password
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon.stub()
        this.User.updateOne = sinon.stub().returns({ exec: sinon.stub() })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.next = sinon.stub()
        return this.LaunchpadController.registerAdmin(
          this.req,
          this.res,
          this.next
        )
      })

      it('should send a 400 response', function () {
        this.res.sendStatus.callCount.should.equal(1)
        return this.res.sendStatus.calledWith(400).should.equal(true)
      })

      it('should not check for existing admins', function () {
        return this._atLeastOneAdminExists.callCount.should.equal(0)
      })

      it('should not call registerNewUser', function () {
        return this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          0
        )
      })
    })

    describe('when an invalid email is supplied', function () {
      beforeEach(function (done) {
        this._atLeastOneAdminExists.resolves(false)
        this.email = 'someone@example.com'
        this.password = 'invalid password'
        this.req.body.email = this.email
        this.req.body.password = this.password
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon.stub()
        this.User.updateOne = sinon.stub().returns({ exec: sinon.stub() })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.AuthenticationManager.validateEmail = sinon
          .stub()
          .returns(new Error('bad email'))
        this.AuthenticationManager.validatePassword = sinon.stub().returns(null)
        this.res.callback = done
        this.next = sinon.stub().callsFake(() => done())
        return this.LaunchpadController.registerAdmin(
          this.req,
          this.res,
          this.next
        )
      })

      it('should send a 400 response', function () {
        this.res.status.callCount.should.equal(1)
        this.res.status.calledWith(400).should.equal(true)
        return this.res.json.calledWith({
          message: { type: 'error', text: 'bad email' },
        })
      })

      it('should not call registerNewUser', function () {
        return this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          0
        )
      })
    })

    describe('when an invalid password is supplied', function () {
      beforeEach(function (done) {
        this._atLeastOneAdminExists.resolves(false)
        this.email = 'someone@example.com'
        this.password = 'invalid password'
        this.req.body.email = this.email
        this.req.body.password = this.password
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon.stub()
        this.User.updateOne = sinon.stub().returns({ exec: sinon.stub() })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.AuthenticationManager.validateEmail = sinon.stub().returns(null)
        this.AuthenticationManager.validatePassword = sinon
          .stub()
          .returns(new Error('bad password'))
        this.res.callback = done
        this.next = sinon.stub().callsFake(() => done())
        return this.LaunchpadController.registerAdmin(
          this.req,
          this.res,
          this.next
        )
      })

      it('should send a 400 response', function () {
        this.res.status.callCount.should.equal(1)
        this.res.status.calledWith(400).should.equal(true)
        return this.res.json.calledWith({
          message: { type: 'error', text: 'bad password' },
        })
      })

      it('should not call registerNewUser', function () {
        return this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          0
        )
      })
    })

    describe('when there are already existing admins', function () {
      beforeEach(function (done) {
        this._atLeastOneAdminExists.resolves(true)
        this.email = 'someone@example.com'
        this.password = 'a_really_bad_password'
        this.req.body.email = this.email
        this.req.body.password = this.password
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon.stub()
        this.User.updateOne = sinon.stub().returns({ exec: sinon.stub() })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.AuthenticationManager.validateEmail = sinon.stub().returns(null)
        this.AuthenticationManager.validatePassword = sinon.stub().returns(null)
        this.res.callback = done
        this.next = sinon.stub().callsFake(() => done())
        return this.LaunchpadController.registerAdmin(
          this.req,
          this.res,
          this.next
        )
      })

      it('should send a 403 response', function () {
        this.res.status.callCount.should.equal(1)
        return this.res.status.calledWith(403).should.equal(true)
      })

      it('should not call registerNewUser', function () {
        return this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          0
        )
      })
    })

    describe('when checking admins produces an error', function () {
      beforeEach(function (done) {
        this._atLeastOneAdminExists.rejects(new Error('woops'))
        this.email = 'someone@example.com'
        this.password = 'a_really_bad_password'
        this.req.body.email = this.email
        this.req.body.password = this.password
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon.stub()
        this.User.updateOne = sinon.stub().returns({ exec: sinon.stub() })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.res.callback = done
        this.next = sinon.stub().callsFake(() => done())
        return this.LaunchpadController.registerAdmin(
          this.req,
          this.res,
          this.next
        )
      })

      it('should call next with an error', function () {
        this.next.callCount.should.equal(1)
        return expect(this.next.lastCall.args[0]).to.be.instanceof(Error)
      })

      it('should have checked for existing admins', function () {
        return this._atLeastOneAdminExists.callCount.should.equal(1)
      })

      it('should not call registerNewUser', function () {
        return this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          0
        )
      })
    })

    describe('when registerNewUser produces an error', function () {
      beforeEach(function (done) {
        this._atLeastOneAdminExists.resolves(false)
        this.email = 'someone@example.com'
        this.password = 'a_really_bad_password'
        this.req.body.email = this.email
        this.req.body.password = this.password
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon
          .stub()
          .rejects(new Error('woops'))
        this.User.updateOne = sinon.stub().returns({ exec: sinon.stub() })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.AuthenticationManager.validateEmail = sinon.stub().returns(null)
        this.AuthenticationManager.validatePassword = sinon.stub().returns(null)
        this.res.callback = done
        this.next = sinon.stub().callsFake(() => done())
        return this.LaunchpadController.registerAdmin(
          this.req,
          this.res,
          this.next
        )
      })

      it('should call next with an error', function () {
        this.next.callCount.should.equal(1)
        return expect(this.next.lastCall.args[0]).to.be.instanceof(Error)
      })

      it('should have checked for existing admins', function () {
        return this._atLeastOneAdminExists.callCount.should.equal(1)
      })

      it('should have called registerNewUser', function () {
        this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          1
        )
        return this.UserRegistrationHandler.promises.registerNewUser
          .calledWith({ email: this.email, password: this.password })
          .should.equal(true)
      })

      it('should not call update', function () {
        return this.User.updateOne.callCount.should.equal(0)
      })
    })

    describe('when user update produces an error', function () {
      beforeEach(function (done) {
        this._atLeastOneAdminExists.resolves(false)
        this.email = 'someone@example.com'
        this.password = 'a_really_bad_password'
        this.req.body.email = this.email
        this.req.body.password = this.password
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon
          .stub()
          .resolves(this.user)
        this.User.updateOne = sinon.stub().returns({
          exec: sinon.stub().rejects(new Error('woops')),
        })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.AuthenticationManager.validateEmail = sinon.stub().returns(null)
        this.AuthenticationManager.validatePassword = sinon.stub().returns(null)
        this.res.callback = done
        this.next = sinon.stub().callsFake(() => done())
        return this.LaunchpadController.registerAdmin(
          this.req,
          this.res,
          this.next
        )
      })

      it('should call next with an error', function () {
        this.next.callCount.should.equal(1)
        return expect(this.next.lastCall.args[0]).to.be.instanceof(Error)
      })

      it('should have checked for existing admins', function () {
        return this._atLeastOneAdminExists.callCount.should.equal(1)
      })

      it('should have called registerNewUser', function () {
        this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          1
        )
        return this.UserRegistrationHandler.promises.registerNewUser
          .calledWith({ email: this.email, password: this.password })
          .should.equal(true)
      })
    })

    describe('when overleaf', function () {
      beforeEach(function (done) {
        this.Settings.overleaf = { one: 1 }
        this.Settings.createV1AccountOnLogin = true
        this._atLeastOneAdminExists.resolves(false)
        this.email = 'someone@example.com'
        this.password = 'a_really_bad_password'
        this.req.body.email = this.email
        this.req.body.password = this.password
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon
          .stub()
          .resolves(this.user)
        this.User.updateOne = sinon
          .stub()
          .returns({ exec: sinon.stub().resolves() })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.AuthenticationManager.validateEmail = sinon.stub().returns(null)
        this.AuthenticationManager.validatePassword = sinon.stub().returns(null)
        this.UserGetter.promises.getUser = sinon
          .stub()
          .resolves({ _id: '1234' })
        this.next = sinon.stub().callsFake(() => done())
        this.res.callback = done
        return this.LaunchpadController.registerAdmin(
          this.req,
          this.res,
          this.next
        )
      })

      it('should send back a json response', function () {
        this.res.json.callCount.should.equal(1)
        expect(this.res.json).to.have.been.calledWith({ redir: '/launchpad' })
      })

      it('should have checked for existing admins', function () {
        return this._atLeastOneAdminExists.callCount.should.equal(1)
      })

      it('should have called registerNewUser', function () {
        this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          1
        )
        return this.UserRegistrationHandler.promises.registerNewUser
          .calledWith({ email: this.email, password: this.password })
          .should.equal(true)
      })

      it('should have updated the user to make them an admin', function () {
        return this.User.updateOne
          .calledWith(
            { _id: this.user._id },
            {
              $set: {
                isAdmin: true,
                emails: [{ email: this.user.email }],
              },
            }
          )
          .should.equal(true)
      })
    })
  })

  describe('registerExternalAuthAdmin', function () {
    beforeEach(function () {
      this.Settings.ldap = { one: 1 }
      return (this._atLeastOneAdminExists = sinon.stub(
        this.LaunchpadController,
        '_atLeastOneAdminExists'
      ))
    })

    afterEach(function () {
      return this._atLeastOneAdminExists.restore()
    })

    describe('when all goes well', function () {
      beforeEach(function (done) {
        this._atLeastOneAdminExists.resolves(false)
        this.email = 'someone@example.com'
        this.req.body.email = this.email
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon
          .stub()
          .resolves(this.user)
        this.User.updateOne = sinon
          .stub()
          .returns({ exec: sinon.stub().resolves() })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.res.callback = done
        this.next = sinon.stub().callsFake(() => done())
        return this.LaunchpadController.registerExternalAuthAdmin('ldap')(
          this.req,
          this.res,
          this.next
        )
      })

      it('should send back a json response', function () {
        this.res.json.callCount.should.equal(1)
        return expect(this.res.json.lastCall.args[0].email).to.equal(this.email)
      })

      it('should have checked for existing admins', function () {
        return this._atLeastOneAdminExists.callCount.should.equal(1)
      })

      it('should have called registerNewUser', function () {
        this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          1
        )
        return this.UserRegistrationHandler.promises.registerNewUser
          .calledWith({
            email: this.email,
            password: 'password_here',
            first_name: this.email,
            last_name: '',
          })
          .should.equal(true)
      })

      it('should have updated the user to make them an admin', function () {
        this.User.updateOne.callCount.should.equal(1)
        return this.User.updateOne
          .calledWith(
            { _id: this.user._id },
            {
              $set: { isAdmin: true },
              emails: [{ email: this.user.email }],
            }
          )
          .should.equal(true)
      })

      it('should have set a redirect in session', function () {
        this.AuthenticationController.setRedirectInSession.callCount.should.equal(
          1
        )
        return this.AuthenticationController.setRedirectInSession
          .calledWith(this.req, '/launchpad')
          .should.equal(true)
      })
    })

    describe('when the authMethod is invalid', function () {
      beforeEach(function () {
        this._atLeastOneAdminExists.resolves(false)
        this.email = undefined
        this.req.body.email = this.email
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon.stub()
        this.User.updateOne = sinon.stub().returns({ exec: sinon.stub() })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.next = sinon.stub()
        return this.LaunchpadController.registerExternalAuthAdmin(
          'NOTAVALIDAUTHMETHOD'
        )(this.req, this.res, this.next)
      })

      it('should send a 403 response', function () {
        this.res.sendStatus.callCount.should.equal(1)
        return this.res.sendStatus.calledWith(403).should.equal(true)
      })

      it('should not check for existing admins', function () {
        return this._atLeastOneAdminExists.callCount.should.equal(0)
      })

      it('should not call registerNewUser', function () {
        return this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          0
        )
      })
    })

    describe('when no email is supplied', function () {
      beforeEach(function () {
        this._atLeastOneAdminExists.resolves(false)
        this.email = undefined
        this.req.body.email = this.email
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon.stub()
        this.User.updateOne = sinon.stub().returns({ exec: sinon.stub() })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.next = sinon.stub()
        return this.LaunchpadController.registerExternalAuthAdmin('ldap')(
          this.req,
          this.res,
          this.next
        )
      })

      it('should send a 400 response', function () {
        this.res.sendStatus.callCount.should.equal(1)
        return this.res.sendStatus.calledWith(400).should.equal(true)
      })

      it('should not check for existing admins', function () {
        return this._atLeastOneAdminExists.callCount.should.equal(0)
      })

      it('should not call registerNewUser', function () {
        return this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          0
        )
      })
    })

    describe('when there are already existing admins', function () {
      beforeEach(function (done) {
        this._atLeastOneAdminExists.resolves(true)
        this.email = 'someone@example.com'
        this.req.body.email = this.email
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon.stub()
        this.User.updateOne = sinon.stub().returns({ exec: sinon.stub() })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.res.callback = done
        this.next = sinon.stub().callsFake(() => done())
        return this.LaunchpadController.registerExternalAuthAdmin('ldap')(
          this.req,
          this.res,
          this.next
        )
      })

      it('should send a 403 response', function () {
        this.res.sendStatus.callCount.should.equal(1)
        return this.res.sendStatus.calledWith(403).should.equal(true)
      })

      it('should not call registerNewUser', function () {
        return this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          0
        )
      })
    })

    describe('when checking admins produces an error', function () {
      beforeEach(function (done) {
        this._atLeastOneAdminExists.rejects(new Error('woops'))
        this.email = 'someone@example.com'
        this.req.body.email = this.email
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon.stub()
        this.User.updateOne = sinon.stub().returns({ exec: sinon.stub() })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.res.callback = done
        this.next = sinon.stub().callsFake(() => done())
        return this.LaunchpadController.registerExternalAuthAdmin('ldap')(
          this.req,
          this.res,
          this.next
        )
      })

      it('should call next with an error', function () {
        this.next.callCount.should.equal(1)
        return expect(this.next.lastCall.args[0]).to.be.instanceof(Error)
      })

      it('should have checked for existing admins', function () {
        return this._atLeastOneAdminExists.callCount.should.equal(1)
      })

      it('should not call registerNewUser', function () {
        return this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          0
        )
      })
    })

    describe('when registerNewUser produces an error', function () {
      beforeEach(function (done) {
        this._atLeastOneAdminExists.resolves(false)
        this.email = 'someone@example.com'
        this.req.body.email = this.email
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon
          .stub()
          .rejects(new Error('woops'))
        this.User.updateOne = sinon.stub().returns({ exec: sinon.stub() })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.res.callback = done
        this.next = sinon.stub().callsFake(() => done())
        return this.LaunchpadController.registerExternalAuthAdmin('ldap')(
          this.req,
          this.res,
          this.next
        )
      })

      it('should call next with an error', function () {
        this.next.callCount.should.equal(1)
        return expect(this.next.lastCall.args[0]).to.be.instanceof(Error)
      })

      it('should have checked for existing admins', function () {
        return this._atLeastOneAdminExists.callCount.should.equal(1)
      })

      it('should have called registerNewUser', function () {
        this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          1
        )
        return this.UserRegistrationHandler.promises.registerNewUser
          .calledWith({
            email: this.email,
            password: 'password_here',
            first_name: this.email,
            last_name: '',
          })
          .should.equal(true)
      })

      it('should not call update', function () {
        return this.User.updateOne.callCount.should.equal(0)
      })
    })

    describe('when user update produces an error', function () {
      beforeEach(function (done) {
        this._atLeastOneAdminExists.resolves(false)
        this.email = 'someone@example.com'
        this.req.body.email = this.email
        this.user = {
          _id: 'abcdef',
          email: this.email,
        }
        this.UserRegistrationHandler.promises.registerNewUser = sinon
          .stub()
          .resolves(this.user)
        this.User.updateOne = sinon.stub().returns({
          exec: sinon.stub().rejects(new Error('woops')),
        })
        this.AuthenticationController.setRedirectInSession = sinon.stub()
        this.res.callback = done
        this.next = sinon.stub().callsFake(() => done())
        return this.LaunchpadController.registerExternalAuthAdmin('ldap')(
          this.req,
          this.res,
          this.next
        )
      })

      it('should call next with an error', function () {
        this.next.callCount.should.equal(1)
        return expect(this.next.lastCall.args[0]).to.be.instanceof(Error)
      })

      it('should have checked for existing admins', function () {
        return this._atLeastOneAdminExists.callCount.should.equal(1)
      })

      it('should have called registerNewUser', function () {
        this.UserRegistrationHandler.promises.registerNewUser.callCount.should.equal(
          1
        )
        return this.UserRegistrationHandler.promises.registerNewUser
          .calledWith({
            email: this.email,
            password: 'password_here',
            first_name: this.email,
            last_name: '',
          })
          .should.equal(true)
      })
    })
  })
})

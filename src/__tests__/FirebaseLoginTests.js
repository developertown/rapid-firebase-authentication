/* eslint-disable no-console */

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import FirebaseLogin from '../FirebaseLogin';

jest.unmock('../FirebaseLogin'); // unmock to use the actual implementation of FirebaseLogin


describe('FirebaseLogin', () => {
  it('emits a form tag', () => {
    const loginComponent = TestUtils.renderIntoDocument(
        <FirebaseLogin firebase="https://foo.bar"/>
    );

    const loginNode = ReactDOM.findDOMNode(loginComponent);
    expect(loginNode.tagName.toLowerCase()).toEqual("form");
  });

  it('emits an error to the log if no firebase attribute is provided', () => {
    spyOn(console, 'error');

    TestUtils.renderIntoDocument(
        <FirebaseLogin />
    );

    expect(console.error.calls.mostRecent().args[0]).toMatch(/Required prop `firebase` was not specified/);
  });

  describe('fbref', () => {
    it('returns the value of the firebase prop if it is an object', () => {
      const inputRef = {foo: "bar"};

      const loginComponent = TestUtils.renderIntoDocument(
          <FirebaseLogin firebase={inputRef}/>
      );
      const val = loginComponent.fbref;

      expect(val).toBe(inputRef);
    });

    it('generates a new firebase ref if the firebase prop is a string (url)', () => {
      const inputRef = 'https://foobar.firebaseio.com';

      const loginComponent = TestUtils.renderIntoDocument(
          <FirebaseLogin firebase={inputRef}/>
      );
      const val = loginComponent.fbref;

      expect(typeof val).toEqual('object');
    });
  });

  describe('_authHandler', () => {
    it('emits an error to the log if either the email or password field is missing', () => {
      spyOn(console, 'error');

      const loginComponent = TestUtils.renderIntoDocument(
          <FirebaseLogin />
      );
      var form = TestUtils.findRenderedDOMComponentWithTag(loginComponent, 'form');

      TestUtils.Simulate.submit(form);

      expect(console.error.calls.mostRecent().args[0]).toMatch(/missing child form fields named/);
    });

    it('does not emit an error to the log if email and password fields are defined', () => {
      spyOn(console, 'error');

      const loginComponent = TestUtils.renderIntoDocument(
          <FirebaseLogin>
            <input type="text" name="email"/>
            <input type="password" name="password"/>
          </FirebaseLogin>
      );
      var form = TestUtils.findRenderedDOMComponentWithTag(loginComponent, 'form');
      TestUtils.Simulate.submit(form);

      expect(console.errors).toBeUndefined();
    });
  });
});
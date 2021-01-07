import React from 'react';
import profilePic from '../assets/profile-pic.jpg';
import { rhythm } from '../utils/typography';

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2),
        }}
      >
        <img
          src={profilePic}
          alt={`Ahmet Can aydemir`}
          style={{
            marginBottom: 0,
            marginRight: rhythm(1 / 2),
            width: rhythm(2),
            height: rhythm(2),
            borderRadius: '50%',
          }}
        />
        <p
          style={{
            maxWidth: '420px',
          }}
        >
          Personal blog by{' '}
          <a href="https://mobile.twitter.com/ahmetcnaydemir">
            Ahmet Can Aydemir
          </a>
          .
          <br />
          My thoughts about Programming and things.
        </p>
      </div>
    );
  }
}

export default Bio;

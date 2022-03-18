import React from 'react';
import { Link } from 'gatsby';
import Toggle from './Toggle';
import Helmet from 'react-helmet';
import HomeIcon from './svg/HomeIcon';
import DownIcon from './svg/DownIcon';
import SunIcon from './svg/SunIcon';
import MoonIcon from './svg/MoonIcon';

import { rhythm, scale } from '../utils/typography';

class Layout extends React.Component {
  state = {
    theme: null,
  };
  componentDidMount() {
    this.setState({ theme: window.__theme });
    window.__onThemeChange = () => {
      this.setState({ theme: window.__theme });
    };
  }
  renderHeader() {
    const { location, title } = this.props;
    const rootPath = `${__PATH_PREFIX__}/`;

    return (
      <div
        style={{
          ...scale(0.75),
          marginBottom: 0,
          marginTop: 0,
          border: 0,
        }}
      >
        <Link
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            color: 'var(--textTitle)',
            marginRight: 5,
          }}
          aria-label="Home"
          to={'/'}
        >
          <HomeIcon />
        </Link>
        <div className="dropdown">
          <DownIcon />

          <div className="dropdown-content">
            <Link to="/about" className={`${title === 'About' && 'selected'}`}>
              About
            </Link>
            <Link
              to="/projects"
              className={`${title === 'Projects' && 'selected'}`}
            >
              Projects
            </Link>
            <Link to="/books" className={`${title === 'Books' && 'selected'}`}>
              Books
            </Link>
            <Link
              to="/watched"
              className={`${title === 'Watched' && 'selected'}`}
            >
              Watched
            </Link>
          </div>
        </div>
      </div>
    );
  }
  render() {
    const { children } = this.props;

    return (
      <div
        style={{
          color: 'var(--textNormal)',
          background: 'var(--bg)',
          transition: 'color 0.2s ease-out, background 0.2s ease-out',
          minHeight: '100vh',
        }}
      >
        <Helmet
          meta={[
            {
              name: 'theme-color',
              content: this.state.theme === 'light' ? '#27a822' : '#282c35',
            },
          ]}
        />
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: rhythm(30),
            padding: `2.625rem ${rhythm(3 / 4)}`,
          }}
        >
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2.625rem',
            }}
          >
            {this.renderHeader()}
            {this.state.theme !== null ? (
              <Toggle
                icons={{
                  checked: <MoonIcon />,
                  unchecked: <SunIcon />,
                }}
                checked={this.state.theme === 'dark'}
                onChange={e =>
                  window.__setPreferredTheme(
                    e.target.checked ? 'dark' : 'light'
                  )
                }
              />
            ) : (
              <div style={{ height: '24px' }} />
            )}
          </header>
          {children}
        </div>
      </div>
    );
  }
}

export default Layout;

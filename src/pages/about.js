import { Link, graphql } from 'gatsby';
import { formatPostDate, formatReadingTime } from '../utils/helpers';

import Bio from '../components/Bio';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import Panel from '../components/Panel';
import React from 'react';
import SEO from '../components/SEO';
import get from 'lodash/get';
import { rhythm, scale } from '../utils/typography';

class About extends React.Component {
  render() {
    const langKey = this.props.pageContext.langKey;

    return (
      <Layout location={this.props.location} title="About">
        <SEO />
        <main>
          <h1
            style={{
              marginBottom: rhythm(1),
              marginTop: 0,
              border: 0,
            }}
          >
            About
          </h1>
          <article style={{ fontSize: rhythm(0.7) }}>
            <p>Hi there,</p>
            <p>
              My name is <strong>Ahmet Can Aydemir</strong> and I'm a Software
              Engineer at{' '}
              <a
                href="https://www.hepsiburada.com/"
                target="_blank"
                rel="noopener nofollow"
              >
                Hepsiburada
              </a>
              .
            </p>
            <p>
              I'm passionate about{' '}
              <strong>Deep Learning, JavaScript, Go</strong> and{' '}
              <strong>C#</strong>. I also develop at{' '}
              <a
                href="https://www.kodvizit.com/"
                target="_blank"
                rel="noopener nofollow"
              >
                kodvizit
              </a>{' '}
              which is my own initiative. In this personal website, you will
              find my thoughts about different topics. You can checkout some of
              my projects in <a href="/projects">/projects</a> page or in{' '}
              <a
                href="https://www.github.com/ahmetcanaydemir"
                target="_blank"
                rel="noopener nofollow"
              >
                my personal GitHub profile
              </a>
              .
            </p>
            <p>
              You can get more information about my personal career in my{' '}
              <a
                href="https://www.linkedin.com/in/ahmetcanaydemir"
                target="_blank"
                rel="noopener nofollow"
              >
                LinkedIn profile
              </a>
              . Also you can follow me on twitter{' '}
              <a
                href="https://www.twitter.com/ahmetcnaydemir"
                target="_blank"
                rel="noopener nofollow"
              >
                @ahmetcnaydemir
              </a>
            </p>
            <p>
              If you have any questions feel free to send an email to{' '}
              <strong>root @ ahmetcanaydemir.com</strong>
            </p>
          </article>
        </main>

        <aside style={{ marginTop: rhythm(3) }}>
          <Bio />
        </aside>
      </Layout>
    );
  }
}

export default About;

export const pageQuery = graphql`
  query {
    allBooksCsv(sort: { fields: Date_Added, order: DESC }) {
      nodes {
        Publisher
        Author_l_f
        Title
        My_Rating
        Number_of_Pages
      }
    }
  }
`;

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

class ProjectsIndex extends React.Component {
  render() {
    const langKey = this.props.pageContext.langKey;

    const projects = get(this, 'props.data.allProjectsCsv.nodes');

    return (
      <Layout location={this.props.location} title="Projects">
        <SEO />
        <main>
          <h1
            style={{
              marginBottom: rhythm(1),
              marginTop: 0,
              border: 0,
            }}
          >
            Projects
          </h1>
          {projects.map(node => {
            const title = `${node.Name}`;
            return (
              <article key={title} style={{ marginBottom: rhythm(1 / 2) }}>
                <header>
                  <p>
                    <span style={{ fontWeight: '600' }}>
                      <Link to={node.Link || '#'}>{title}</Link>{' '}
                    </span>{' '}
                    — {`${node.Description}`}
                  </p>
                  <small></small>
                </header>
              </article>
            );
          })}
        </main>

        <aside style={{ marginTop: rhythm(3) }}>
          <Bio />
        </aside>
      </Layout>
    );
  }
}

export default ProjectsIndex;

export const pageQuery = graphql`
  query {
    allProjectsCsv {
      nodes {
        Name
        Link
        Description
      }
    }
  }
`;

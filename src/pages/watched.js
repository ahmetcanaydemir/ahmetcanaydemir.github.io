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

class WatchedIndex extends React.Component {
  render() {
    const langKey = this.props.pageContext.langKey;

    const watched = get(this, 'props.data.allWatchedCsv.nodes');
    const movieCount = watched.filter(node => node.Title_Type === 'movie')
      .length;
    const getMovies = type => {
      return watched
        .filter(node => node.Title_Type === type)
        .map(node => {
          const title = `${node.Title}`;
          return (
            <article key={title}>
              <header>
                <h4
                  style={{
                    fontSize: rhythm(0.6),
                    marginBottom: rhythm(1 / 14),
                  }}
                >
                  <a
                    href={`https://www.imdb.com/title/${node.Const}/`}
                    target="_blank"
                    rel="noopener no referrer"
                  >
                    {title}
                  </a>
                </h4>
                <small>
                  {`${node.Year} • ${node.Runtime} minutes${ratingToStar(
                    node.Your_Rating
                  )}`}
                </small>
              </header>
            </article>
          );
        });
    };
    const ratingToStar = rating => {
      if (Number(rating)) {
        return ` • ${new Array(Number(rating) || 0).fill('★').join('')}`;
      }
      return '';
    };
    return (
      <Layout location={this.props.location} title="Watched">
        <SEO />
        <main>
          <h1
            style={{
              marginBottom: 0,
              marginTop: 0,
              border: 0,
            }}
          >
            Watched
          </h1>
          Movies and tv series I rated on IMDB.
          <h3 style={{ marginBottom: rhythm(0.2) }}>Movies ({movieCount})</h3>
          <hr />
          {getMovies('movie')}
          <h3 style={{ marginBottom: rhythm(0.2) }}>
            Series ({watched.length - movieCount})
          </h3>
          <hr />
          {getMovies('tvSeries')}
          {getMovies('tvMiniSeries')}
        </main>

        <aside style={{ marginTop: rhythm(3) }}>
          <Bio />
        </aside>
      </Layout>
    );
  }
}

export default WatchedIndex;

export const pageQuery = graphql`
  query {
    allWatchedCsv(sort: { fields: Date_Rated, order: DESC }) {
      nodes {
        Const
        Runtime
        Title
        Title_Type
        Year
        Your_Rating
      }
    }
  }
`;

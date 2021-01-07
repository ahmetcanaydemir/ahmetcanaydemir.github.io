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

class BooksIndex extends React.Component {
  render() {
    const langKey = this.props.pageContext.langKey;

    const books = get(this, 'props.data.allBooksCsv.nodes');
    const getBooks = shelf => {
      return books
        .filter(node => node.Exclusive_Shelf === shelf)
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
                  {title}
                </h4>
                <small>
                  {`${node.Author_l_f} • ${node.Publisher} • ${
                    node.Number_of_Pages
                  } pages${ratingToStar(node.My_Rating)}`}
                </small>
              </header>
            </article>
          );
        });
    };
    const ratingToStar = rating => {
      if (Number(rating)) {
        return ` • ${new Array(Number(rating) || 0).fill('⭑').join('')}`;
      }
      return '';
    };
    return (
      <Layout location={this.props.location} title="Books">
        <SEO />
        <main>
          <h1
            style={{
              marginBottom: 0,
              marginTop: 0,
              border: 0,
            }}
          >
            Books
          </h1>
          <h3 style={{ marginBottom: rhythm(0.2) }}>Reading</h3>
          <hr />
          {getBooks('currently-reading')}
          <h3 style={{ marginBottom: rhythm(0.2) }}>Readed</h3>
          <hr />
          {getBooks('read')}
          <h3 style={{ marginBottom: rhythm(0.2) }}>To-Read</h3>
          <hr />
          {getBooks('to-read')}
        </main>

        <aside style={{ marginTop: rhythm(3) }}>
          <Bio />
        </aside>
      </Layout>
    );
  }
}

export default BooksIndex;

export const pageQuery = graphql`
  query {
    allBooksCsv(sort: { fields: Date_Added, order: DESC }) {
      nodes {
        Publisher
        Author_l_f
        Title
        My_Rating
        Number_of_Pages
        Exclusive_Shelf
      }
    }
  }
`;

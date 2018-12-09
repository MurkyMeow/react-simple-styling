import React from 'react';
import { css, useClasses } from '../util/styling';

import Card from './Card.Robust';

const prefix = css`
  .card {
    width: 300px;
    margin: 0 auto;
    text-align: center;
  }
`;

export default function App() {
  const classes = useClasses(arguments, prefix);
  return (
    <div className={classes}>
      <Card className="card">
        Hello world!
      </Card>
    </div>
  );
}
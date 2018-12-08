import React from 'react';
import { css, useClasses } from '../util/styling';

import Card from './Card';

const prefix = css`
  .card {
    width: 300px;
    margin: 0 auto;
    text-align: center;
  }
`;

export default function App() {
  const classes = useClasses(arguments, 'card', prefix);
  return (
    <div>
      <Card className={classes}>
        Hello world!
      </Card>
    </div>
  );
}
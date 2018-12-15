import React from 'react';
import { css, styled } from '../util/styling';

import Card from './Card';

const prefix = css`
  .card {
    width: 300px;
    margin: 0 auto;
    text-align: center;
  }
`;

const App = ()=> (
  <div>
    <Card className="card">
      Hello world!
    </Card>
  </div>
);

export default styled(prefix)(App);
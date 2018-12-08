import React from 'react';
import { css, styled } from '../util/styling';

import Card from './Card';

//write normal css
const prefix = css`
  .card {
    width: 300px;
    margin: 0 auto;
    text-align: center;
  }
`;

//write normal class names!
const App = ()=> (
  <div>
    <Card className="card">
      Hello world!
    </Card>
  </div>
);

//styled wrapper will apply the style and add scoping to it!
export default styled(prefix)(App);
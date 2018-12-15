import React from 'react';
import { styleable } from '../util/styling.js';

const Card = ({children})=> (
  <div className="card-bg rounded p-2">
    {children}
  </div>
);

export default styleable(Card);
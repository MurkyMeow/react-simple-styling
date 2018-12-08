import React from 'react';
import { styled } from '../util/styling.js';

//Wanna pass className to the component from it's parent?

//no more extracting and applying className manually!
const Card = ({children})=> (
  <div className="card-bg rounded p-2">
    {children}
  </div>
);

//styled wrapper will take care of it!
export default styled()(Card);
import React from 'react';
import { useClasses } from '../util/styling.js';

export default function Card({children}) {
  //passing "arguments" allows component to grab className from props
  //other class names are provided to avoid concatenation
  const classes = useClasses(arguments, 'card-bg rounded p-2');
  return (
    <div className={classes}>
      {children}
    </div>
  );
}
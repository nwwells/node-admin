// @flow

import React from 'react';

const Json = (props: mixed) => <pre>{JSON.stringify(props, undefined, 2)}</pre>;

export default Json;

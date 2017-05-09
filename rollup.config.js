import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';

export default {
  entry: 'client/main.js',
  dest: 'dist/bundle.js',
  format: 'iife',
  sourceMap: true,
  plugins: [
    commonjs({
      include: 'node_modules/**'
    }),
    resolve({
      jsnext: true,
      main: true,
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV || 'development' )
    })
  ]
}

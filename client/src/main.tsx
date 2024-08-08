import './index.css'
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './lib/store'; // Import the Redux store

ReactDOM.render(
  <Provider store={store}> {/* Provide the store to your app */}
    <App />
  </Provider>,
  document.getElementById('root')
);

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Globally mock react-quill-new to avoid ESM compilation errors in Jest
jest.mock('react-quill-new', () => {
  return function MockReactQuill() {
    return <div data-testid="mock-react-quill" />;
  };
});



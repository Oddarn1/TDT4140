import React from 'react';
import Enzyme,{mount} from 'enzyme';
import {MemoryRouter} from 'react-router-dom';
import Landing from '../../components/Landing';
import App from '../../components/App';
import NotFound from '../../components/NotFound';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({adapter: new Adapter()});

jest.mock('../../components/App/index.js');

test('invalid path should redirect to 404', () => {
    const wrapper = mount(
        <MemoryRouter initialEntries={[ '/random' ]}>
            <App/>
        </MemoryRouter>
    );
    expect(wrapper.find(Landing)).toHaveLength(0);
    expect(wrapper.find(NotFound)).toHaveLength(1);
});

test('valid path should not redirect to 404', () => {
    const wrapper = mount(
        <MemoryRouter initialEntries={[ '/' ]}>
            <App/>
        </MemoryRouter>
    );
    expect(wrapper.find(Landing)).toHaveLength(1);
    expect(wrapper.find(NotFound)).toHaveLength(0);
});
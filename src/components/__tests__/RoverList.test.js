import React from 'react';
import { MemoryRouter } from 'react-router';
import {
  Button, Card, Header, Icon, Loader,
} from 'semantic-ui-react';
import { shallow, mount } from 'enzyme';
import RoverList from '../RoverList';

let fetchRovers;
let removeRover;

describe('The RoverList component', () => {
  beforeEach(() => {
    fetchRovers = jest.fn(() => Promise.resolve({}));
    removeRover = jest.fn(() => Promise.resolve({}));
  });

  test('renders on the page with no errors', () => {
    const wrapper = shallow(<RoverList fetchRovers={fetchRovers} removeRover={removeRover} />);
    expect(wrapper).toMatchSnapshot();
  });

  test('fetches rovers on mount', async () => {
    fetchRovers = jest.fn();
    await mount(
      <MemoryRouter>
        <RoverList fetchRovers={fetchRovers} removeRover={removeRover} />
      </MemoryRouter>,
    );
    expect(fetchRovers.mock.calls.length).toBe(1);
  });

  test('shows the correct number of rovers for the user', async () => {
    const rovers = [{
      id: 1,
      name: 'Sparky',
      owner: 1,
      connected: true,
    }, {
      id: 2,
      name: 'Marvin',
      owner: 1,
      connected: false,
    }];
    const wrapper = shallow(
      <RoverList
        rovers={rovers}
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    );
    await wrapper.instance().componentDidMount();
    wrapper.update();

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Loader).exists()).toBe(false);

    expect(wrapper.find(Card).length).toBe(2);
    expect(wrapper.find(Card).first().find(Button).first()
      .prop('to')).toBe('/rovers/1');
    expect(wrapper.find(Card).first().find(Icon).prop('color')).toBe('green');
    expect(wrapper.find(Card.Header).first().prop('children')).toBe('Sparky');
    expect(wrapper.find(Card.Meta).first().prop('children')).toBe('Connected');

    expect(wrapper.find(Card).last().find(Button).first()
      .prop('to')).toBe('/rovers/2');
    expect(wrapper.find(Card).last().find(Icon).prop('color')).toBe('red');
    expect(wrapper.find(Card.Header).last().prop('children')).toBe('Marvin');
    expect(wrapper.find(Card.Meta).last().prop('children')).toBe('Not connected');
  });

  test('shows no rovers on error', async () => {
    const rovers = [];
    const wrapper = shallow(
      <RoverList
        rovers={rovers}
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    );
    await wrapper.instance().componentDidMount();
    wrapper.update();

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Loader).exists()).toBe(false);
  });

  test('removes a rover and reloads the rover list', async () => {
    const rovers = [{
      id: 1,
      name: 'Sparky',
      owner: 1,
      connected: true,
    }, {
      id: 2,
      name: 'Marvin',
      owner: 1,
      connected: false,
    }];
    const wrapper = shallow(
      <RoverList
        rovers={rovers}
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    );

    await wrapper.instance().removeRover(null, {
      id: 1,
    });

    expect(fetchRovers).toHaveBeenCalledTimes(2);
    expect(removeRover).toHaveBeenCalledWith(1);
  });

  test('shows confirm dialog', () => {
    const wrapper = shallow(
      <RoverList
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    );

    wrapper.instance().showConfirm();

    expect(wrapper.state('confirmOpen')).toBe(true);
  });

  test('cancel dialog does not remove rover', () => {
    const wrapper = shallow(
      <RoverList
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    );

    wrapper.instance().cancelRemove();

    expect(fetchRovers).toHaveBeenCalledTimes(1);
    expect(removeRover).not.toHaveBeenCalled();
    expect(wrapper.state('confirmOpen')).toBe(false);
  });
});

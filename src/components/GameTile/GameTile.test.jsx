import {shallow} from 'enzyme';
import GameTile from './GameTile';

describe('GameBoard component', () => {
    let component;

    beforeEach(() => {
        // build the component
        component = shallow(<GameTile/>);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders successfully', () => {
        expect(component).not.toBeNull();
    });
});

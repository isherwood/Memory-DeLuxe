import {shallow} from 'enzyme';
import GameSquare from './GameBoard';

describe('GameBoard component', () => {
    let component;

    beforeEach(() => {
        // build the component
        component = shallow(<GameSquare/>);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders successfully', () => {
        expect(component).not.toBeNull();
    });
});

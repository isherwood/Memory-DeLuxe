import {shallow} from 'enzyme';
import GameBoard from './GameBoard';

describe('GameBoard component', () => {
    let component;

    beforeEach(() => {
        // build the component
        component = shallow(<GameBoard/>);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders successfully', () => {
        expect(component).not.toBeNull();
    });
});

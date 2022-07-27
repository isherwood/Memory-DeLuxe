import {shallow} from 'enzyme';
import GameConfig from './GameConfig';

describe('GameConfig component', () => {
    let component;

    beforeEach(() => {
        // build the component
        component = shallow(<GameConfig/>);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders successfully', () => {
        expect(component).not.toBeNull();
    });
});

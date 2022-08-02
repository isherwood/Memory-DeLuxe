import {shallow} from 'enzyme';
import GameBox from './GameBox';

describe('GameBoard component', () => {
    let component;

    beforeEach(() => {
        // build the component
        component = shallow(<GameBox/>);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders successfully', () => {
        expect(component).not.toBeNull();
    });
});

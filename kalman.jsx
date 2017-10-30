const FRONT_VECTOR_LENGTH = 10;
const DELTA_THETA = .1;
const ACCELERATION = 1;
const SPEED_LOSS = .01;
const LEFT_KEYCODE = 37;
const UP_KEYCODE = 38;
const RIGHT_KEYCODE = 39;
const DOWN_KEYCODE = 40;

const Simulator = React.createClass({
  getInitialState() {
    return {
      x_car: 50,
      y_car: 50,
      speed: 0,
      theta: 0 // radians
    };
  },

  tick() {
    this.setState(({ speed, theta, x_car, y_car }) => {
      // Subexpressions
      const delta_x = speed * Math.cos(theta);
      const delta_y = -speed * Math.sin(theta);
      const new_unsigned_speed = Math.abs(speed) - SPEED_LOSS;

      // Normal, far from boundary
      let new_x = x_car + delta_x;
      let new_y = y_car + delta_y;
      let new_speed = new_unsigned_speed > 0 ? new_unsigned_speed * Math.sign(speed) : 0;

      // Impose boundary conditions
      if (new_y < 0) {
        new_y = 0;
        new_speed = 0;
      }
      if (new_y > window.innerHeight) {
        new_y = window.innerHeight;
        new_speed = 0;
      }
      if (new_x < 0) {
        new_x = 0;
        new_speed = 0;
      }
      if (new_x > window.innerWidth) {
        new_x = window.innerWidth;
        new_speed = 0;
      }

      return {
        x_car: new_x,
        y_car: new_y,
        speed: new_speed
      };
    });
  },

  componentDidMount() {
    this.setupKeyBindings();
    this.interval = setInterval(this.tick, 10);
  },

  setupKeyBindings() {
    $(document).keydown((e) => {
      switch(e.which) {
        case LEFT_KEYCODE:
          this.setState((state) => ({theta: state.theta + DELTA_THETA}));
        break;

        case UP_KEYCODE:
          this.setState((state) => ({speed: state.speed + ACCELERATION}));
        break;

        case RIGHT_KEYCODE:
          this.setState((state) => ({theta: state.theta - DELTA_THETA}));
        break;

        case DOWN_KEYCODE:
          this.setState((state) => ({speed: state.speed - ACCELERATION}));
        break;

        default: return;
      }

      e.preventDefault(); // prevent scroll / move caret
    });
  },

  render() {
    return <svg width="100%" height="100%">
      <Car x={this.state.x_car} y={this.state.y_car} />
      <FrontVector x={this.state.x_car} y={this.state.y_car} theta={this.state.theta} />
    </svg>;
  }
});

const Car = ({ x, y }) => <circle cx={x} cy={y} r="5" stroke="black" stroke-width="3" fill="black"/>;

const FrontVector = ({ x, y, theta }) => {
  const delta_x = FRONT_VECTOR_LENGTH * Math.cos(theta);
  const delta_y = -FRONT_VECTOR_LENGTH * Math.sin(theta);
  return <line x1={x} x2={x + delta_x} y1={y} y2={y + delta_y} style={{stroke: "black"}} />;
};

ReactDOM.render(<Simulator />, document.getElementById("simulator"));

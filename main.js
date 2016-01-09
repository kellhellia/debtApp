class App extends React.Component {
    constructor() {
        super();
        this.state = {
            myCredits: [],
            guysCredits: [],
            totalGuysCredit: null,
            alert: false
        };
    }

    componentDidMount() {
        let ls = localStorage;
        let guysCredits = JSON.parse(ls.getItem("list"));
        let sumArr = [];

        if (!guysCredits || guysCredits.length === 0) {
            let arr = [];
            sumArr = ["0"];
            ls.setItem("list", JSON.stringify(arr));
            ls.setItem("totalGuysCredit", JSON.stringify(sumArr));

            this.setState({totalGuysCredit: sumArr});
        } else if (guysCredits) {
            _.each(guysCredits, (n, index) => {
                sumArr.push(+n.credit);
            });

            let totalGuysCredit = _.reduce(sumArr, (total, n) => {
                return total + n;
            });

            this.setState({guysCredits, totalGuysCredit}, () => {
                console.log(this.state);
            });
        }
    }

    handleOnFocusInput(e) {
        this.setState({alert: false});
    }

    handleAddCredit(e) {
        e.preventDefault();

        //get data from localStorage and inputs

        let ls = localStorage;

        let list = JSON.parse(ls.getItem("list"));

        let name = this.refs.name.value;
        let description = this.refs.description.value;
        let credit = this.refs.credit.value;

        // calculate value of total credit

        let numberExpr = /^[0-9]*$/g;

        if (((credit.toString())).match(numberExpr)) {

            let totalGuysCredit = +credit + +this.state.totalGuysCredit;

            this.setState({totalGuysCredit});

            //set item to localStorage and state

            let el = {
                name,
                description,
                credit
            }

            list.push(el);

            ls.setItem("list", JSON.stringify(list));
            let guysCredits = this.state.guysCredits;
            guysCredits.push(el);
            this.setState({guysCredits});

            // clear our inputs

            this.refs.credit.value = null;
            this.refs.description.value = null;
            this.refs.name.value = null;
        } else {
            // set alert

            this.setState({alert});
        }
    }

    handleDelete(user) {
        let ls = localStorage;
        let list = this.state.guysCredits;

        let filteredList = _.filter(list, (n) => {
            return n.name !== user.name;
        });

        this.setState({guysCredits: filteredList});
        ls.setItem("list", JSON.stringify(filteredList));

        let totalGuysCredit = this.state.totalGuysCredit - user.credit;
        this.setState({totalGuysCredit});
    }

    render() {
        let ls = localStorage;
        let lsList = JSON.parse(ls.getItem("list"));

        let guysList = _.map(this.state.guysCredits, (n, index) => {
            return <li className="clearfix" key={index}>
                      <div className="list__item">
                          <div className="row">
                             <div className="col-xs-6">
                                {n.name}
                             </div>

                             <div className="col-xs-6 text-right">
                                <i className="list__icon blue glyphicon glyphicon-pencil"></i>
                                <i onClick={this.handleDelete.bind(this, n)} className="list__icon red glyphicon glyphicon-remove"></i>
                              </div>
                          </div>
                          <div className="row">
                             <div className="col-xs-12">
                                {n.credit} - {n.description}
                             </div>
                          </div>
                      </div>
                   </li>;
        });

        let list = (this.state.guysCredits.length !== 0) ? '' : "Please, add new debt :)";
        let alert = this.state.alert ? <div className="alert alert-danger" role="alert">Please, enter number in dollar input</div> : "";

        return (
            <div className="container">
                <h2 className="text-center">Total credit: {this.state.totalGuysCredit}</h2>

                <div className="row">
                    <div className="col-xs-6 col-xs-offset-3">
                        <form onSubmit={this.handleAddCredit.bind(this)}>

                            <div className="row">
                                <div className="col-xs-8 col-xs-offset-2">
                                    <div className="input-group form-group">
                                      <span className="input-group-addon">
                                        <i className="glyphicon glyphicon-user" />
                                      </span>
                                      <input
                                            ref="name"
                                            onFocus={this.handleOnFocusInput.bind(this)}
                                            className="form-control form-group"
                                            placeholder="Name"
                                            required
                                      />
                                    </div>

                                    <div className="input-group form-group">
                                      <span className="input-group-addon">
                                        <i className="glyphicon glyphicon-pencil" />
                                      </span>
                                      <input
                                            ref="description"
                                            onFocus={this.handleOnFocusInput.bind(this)}
                                            className="form-control"
                                            placeholder="Description(optional)"
                                      />
                                    </div>

                                    <div className="input-group form-group">
                                      <span className="input-group-addon">
                                        <i className="glyphicon glyphicon-usd" />
                                      </span>
                                      <input
                                          ref="credit"
                                          onFocus={this.handleOnFocusInput.bind(this)}
                                          className="form-control"
                                          placeholder="Debt"
                                          required
                                      />
                                    </div>

                                    {alert}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xs-8 col-xs-offset-2">
                                    <button type="submit" className="btn btn-primary center-block">Add new debt</button>
                                </div>
                            </div>
                        </form>

                        <div className="row">
                            <div className="col-xs-8 col-xs-offset-2">
                                <h3>Debtors</h3>

                                <ul className="list list-unstyled">
                                    {list}
                                    {guysList}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
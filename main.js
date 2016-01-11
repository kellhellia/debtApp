class App extends React.Component {
    constructor() {
        super();
        this.state = {
            guysCredits: [],
            totalGuysCredits: null,
            alert: false
        };
    }

    componentDidMount() {
        let ls = localStorage;
        let guysCredits = JSON.parse(ls.getItem("list"));

        if (!guysCredits || guysCredits.length === 0) {
            let arr = [];
            ls.setItem("list", JSON.stringify(arr));
        } else if (guysCredits) {

            let guysTotalCredits = [];

            _.map(guysCredits, (n) => {
                _.map(n.debs, (m) => {
                    guysTotalCredits.push(+m.debt);
                });
            });

            let totalSum = _.sum(guysTotalCredits);

            this.setState({guysCredits, guysTotalCredits: totalSum});
        }
    }

    handleOnFocusInput(e) {
        this.setState({alert: false});
    }

    handleAddCredit(e) {
        e.preventDefault();

        let ls = localStorage;
        let list = JSON.parse(ls.getItem("list"));

        let name = this.refs.name.value;
        let description = this.refs.description.value;
        let credit = this.refs.credit.value;

        let numberExpr = /^[0-9]*$/g;

        if (((credit.toString())).match(numberExpr)) {
            let userObject = _.find(list, (n) => {
                 return n.name === name;
            });

            let index = _.findIndex(list, (n) => {
                return n.name === name;
            });

            if (userObject !== undefined) {
                let newUser = userObject;
                newUser.debs.push({"debt":credit, "description" : description});
                list.splice(index, 1, newUser);
                ls.setItem("list", JSON.stringify(list));
                this.setState({"guysCredits" : list, guysTotalCredits});
            } else {
                let el = {
                    name,
                    debs: []
                };

                el.debs.push({"debt" : credit, "description" : description});
                list.push(el);
                ls.setItem("list", JSON.stringify(list));
                this.setState({"guysCredits" : list});
            }

            let guysTotalCredits = +this.state.guysTotalCredits + +credit;
            this.setState({guysTotalCredits});

            this.refs.name.value = null;
            this.refs.description.value = null;
            this.refs.credit.value = null;
        } else {
            this.setState({alert});
        }
    }

    handleDelete(user, debt) {
        let ls = localStorage;
        let list = this.state.guysCredits;

        let indexDebs = _.findIndex(user.debs, (n) => {
            return n.debt === debt.debt;
        });

        user.debs.splice(indexDebs, 1);

        let indexUser = _.findIndex(list, (n) => {
            return n.name === user.name;
        });

        list.splice(indexUser, 1, user);

        if (user.debs.length === 0) {
            list = _.filter(list, (n) => {
                return n.name !== user.name;
            });
        };

        console.log(debt.debt);

        let guysTotalCredits = +this.state.guysTotalCredits - +debt.debt;

        this.setState({guysCredits: list, guysTotalCredits});
        ls.setItem("list", JSON.stringify(list));
    }

    render() {
        let lsList = this.state.guysCredits;

        let guysList = _.map(lsList, (n, index) => {
            let credits = _.map(n.debs, (m, key) => {
                return <div className="row" key={key}>
                    <div className="col-xs-6">{m.debt} - {m.description}</div>
                     <div className="col-xs-6 text-right">
                        <i onClick={this.handleDelete.bind(this, n, m)} className="list__icon red glyphicon glyphicon-remove"></i>
                      </div>
                </div>;
            });

            return <li className="clearfix" key={index}>
                      <div className="list__item">
                          <div className="row">
                             <div className="col-xs-6">
                                {n.name}
                             </div>
                          </div>
                          <div className="row">
                             <div className="col-xs-12">
                                {credits}
                             </div>
                          </div>
                      </div>
                   </li>;
        });

        let list = (this.state.guysCredits.length !== 0) ? '' : "Please, add new debt :)";
        let alert = this.state.alert ? <div className="alert alert-danger" role="alert">Please, enter a valid number</div> : "";

        return (
            <div className="container">
                <div className="row">
                    <h2 className="text-center">myCredits</h2>
                    <div className="col-xs-6 col-xs-offset-3">
                        <form onSubmit={this.handleAddCredit.bind(this)}>

                            <div className="row">
                                <div className="col-xs-8 col-xs-offset-2">
                                    <h3>Add new credit</h3>
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
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xs-8 col-xs-offset-2">
                                    <button type="submit" className="btn btn-primary center-block">Add new debt</button>
                                    {alert}
                                </div>
                            </div>
                        </form>

                        <div className="row">
                            <div className="col-xs-8 col-xs-offset-2">
                                <h3>Debtors</h3>

                                <ul className="list list-unstyled">
                                    {guysList}
                                    {list}
                                    <p>Total debt: {this.state.guysTotalCredits}</p>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
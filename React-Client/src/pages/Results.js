import React from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    InputGroup, InputGroupAddon, Button, Input, TabContent, TabPane, Card, CardTitle, CardText, Row, Col,
    ListGroup, ListGroupItem, Table,
} from 'reactstrap';
import classnames from 'classnames';
import { toastr } from 'react-redux-toastr';
import { scrap } from '../service/scrap';

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            activeTab: '1',
            url: '',
            loading: false,
            results: [],
        }
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    toggle() {
        this.state.isOpen ? this.setState({ isOpen: false }) : this.setState({ isOpen: true });
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit() {
        const url = this.state.url;
        console.log("submit url:" + url);

        if (url == '') {
            toastr.error("Input Failed", "Empty Input. Please fill out!");
        }
        else if (url.search("http://") == -1 && url.search("https://") == -1) {
            toastr.error("Input Failed", "Not matched url format");
        }
        else {
            this.setState({
                loading: true,
            });
            scrap(url)
                .then((res) => {
                    if (res.status === 404) {
                        this.setState({
                            loading: false,
                        });
                        toastr.error("Failed Search", "No Internet! or Bad Request" + res.results.message);
                    }
                    else {
                        console.log("resutls of scrap", res.results);
                        this.setState({
                            loading: false,
                            results: res.results,
                        });
                        toastr.success("Success Scrap", "Web Site Scrap is completed successfully!");
                    }
                }, (error) => {
                    console.log("results error");
                    console.log(error);
                    this.setState({
                        loading: false,
                    });
                    toastr.error("Scrap Failed", "Internal Server Error");
                })
        }
    }



    render() {
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">reactstrap</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="#">Components</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#">GitHub</NavLink>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Options
                        </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        Option 1
                            </DropdownItem>
                                    <DropdownItem>
                                        Option 2
                            </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem>
                                        Reset
                            </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>
                <div className="container">
                    <br />
                    <div className="container row">
                        <h2>Please insert the site url you want scrap</h2>
                    </div>
                    <InputGroup>
                        <Input type="text" placeholder="http://example.com" name="url" onChange={this.handleChange} />
                        <InputGroupAddon addonType="append">
                            <Button color="success" onClick={this.handleSubmit} >SUBMIT!</Button>
                        </InputGroupAddon>
                    </InputGroup>
                    <br />
                    <div className="results">
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab == '1' })}
                                    onClick={() => this.setState({ activeTab: '1' })}
                                >
                                    Title &amp; Load Time
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab == '2' })}
                                    onClick={() => this.setState({ activeTab: '2' })}
                                >
                                    Headings
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab == '3' })}
                                    onClick={() => this.setState({ activeTab: '3' })}
                                >
                                    Pictures
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab == '4' })}
                                    onClick={() => this.setState({ activeTab: '4' })}
                                >
                                    Links
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Row>
                                    <Col sm="6">
                                        <Card body>
                                            <CardTitle>Title of Website Page</CardTitle>
                                            <CardText>With supporting text below as a natural lead-in to web page Title.</CardText>
                                            <Button>{this.state.results.title}</Button>
                                        </Card>
                                    </Col>
                                    <Col sm="6">
                                        <Card body>
                                            <CardTitle>Loading Time of Website Page</CardTitle>
                                            <CardText>Supporting number below as a natural lead-in to web page load Time.</CardText>
                                            <Button></Button>
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2">
                                <Row>
                                    <Col sm="6">
                                        <Card body>
                                            <CardTitle>Number of Headings</CardTitle>
                                            <Button>{this.state.results.hcount}</Button>
                                        </Card>
                                    </Col>
                                    <Col sm="6">
                                        <Card body>
                                            <CardTitle>Levels and Numbers of Headings</CardTitle>
                                            <Table bordered>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Level &amp; Count</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.results.h? this.state.results.h.map((everyh, index) => (
                                                        <tr key={index}>
                                                            <th>
                                                                {index}
                                                            </th>
                                                            <th>
                                                                {everyh}
                                                            </th>
                                                        </tr>)
                                                    ): ''}
                                                </tbody>
                                            </Table>
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="3">
                                <Row>
                                    <Col sm="12">
                                        <ListGroup>
                                            <ListGroupItem>Title of Website Page: &nbsp;{this.state.results.title}</ListGroupItem>
                                            <ListGroupItem>Loading Time of Website Page:</ListGroupItem>
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="4">
                                <Row>
                                    <Col sm="12">
                                        <h4>Tab 4 Contents</h4>
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                    </div>
                </div>

            </div>
        );
    }
}

export default Results;
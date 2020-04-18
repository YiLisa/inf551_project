import React, { Component } from "react";
import { Select } from "antd";
import "antd/dist/antd.css";
const { Option } = Select;

class DBSelection extends Component {
  state = {
    current_database: null, //default
  };

  onChange = (value) => {
    this.state.current_database = value;
    this.setState({ current_database: value });
    this.props.getChildValue(this.state.current_database);
  };

  render() {
    return (
      <div>
        <h3>Choose a Database</h3>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Databases"
          optionFilterProp="children"
          onChange={this.onChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          <Option value="world">world</Option>
          <Option value="employees">employees</Option>
          <Option value="classicmodels">retail</Option>
        </Select>
      </div>
    );
  }
}

export default DBSelection;

import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import {
  Datatable,
  initTE,
} from "tw-elements";


interface TableauProps {
  loginer: UseLoginDto;
}

export default function NavBar({
  loginer,
}: TableauProps) {

  initTE({ Datatable });

  const datatable = React.useRef<HTMLDivElement | null>(null);
  
  React.useEffect(() => {
    const columns = [
      { label: 'Address', field: 'address' },
      { label: 'Company', field: 'company' },
      { label: 'Email', field: 'email' },
      { label: 'Name', field: 'name' },
      { label: 'Phone', field: 'phone' },
      { label: 'Username', field: 'username' },
      { label: 'Website', field: 'website' },
    ];

    if (datatable.current) {
      
      const asyncTable = new Datatable(
        datatable.current,
        { columns, },
        { loading: true }
      );
    
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => {
        asyncTable.update(
          {
            rows: data.map((user: any) => ({
              ...user,
              address: `${user.address.city}, ${user.address.street}`,
              company: user.company.name,
            })),
          },
          { loading: false }
        );
      });
    }
  }, [])

  //
  return (
    <div ref={datatable}></div>
  );
}
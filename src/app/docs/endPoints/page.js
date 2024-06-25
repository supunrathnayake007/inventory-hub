"use client";
import React, { useEffect, useRef } from "react";

const Endpoints = () => {
  // TitleSection component as a nested functional component
  const TitleSection = ({ id, title, paragraph, reference }) => {
    return (
      <div
        id={id}
        ref={reference}
        className="mb-4 mt-4 rounded-lg bg-white p-4 shadow-md"
      >
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p dangerouslySetInnerHTML={{ __html: paragraph }}></p>
      </div>
    );
  };

  // Create refs for each title section
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const title3Ref = useRef(null);
  const title4Ref = useRef(null);

  // Function to scroll to the referenced element
  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    // Event delegation for smooth scrolling
    const handleScroll = (e) => {
      e.preventDefault();
      if (e.target.tagName === "A") {
        const id = e.target.getAttribute("href").substring(1);
        switch (id) {
          case "title1":
            scrollToRef(title1Ref);
            break;
          case "title2":
            scrollToRef(title2Ref);
            break;
          case "title3":
            scrollToRef(title3Ref);
            break;
          case "title4":
            scrollToRef(title4Ref);
            break;
          default:
            break;
        }
      }
    };

    document.querySelector(".w-full").addEventListener("click", handleScroll);

    return () => {
      document
        .querySelector(".w-full")
        .removeEventListener("click", handleScroll);
    };
  }, []);

  return (
    <div className="endpoints-page">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-48  h-3/6  overflow-y-auto bg-gray-100 p-4 lg:fixed  rounded-r-lg">
          <h3 className="text-lg font-semibold mb-4 hidden lg:block">Titles</h3>
          <ul className="lg:sticky lg:top-0 lg:pt-4  lg:overflow-y-auto">
            <li className="mb-2">
              <a
                href="#title1"
                className="text-blue-500 hover:underline block lg:inline-block lg:mb-2"
              >
                Manage User
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#title2"
                className="text-blue-500 hover:underline block lg:inline-block lg:mb-2"
              >
                Categories
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#title3"
                className="text-blue-500 hover:underline block lg:inline-block lg:mb-2"
              >
                Suppliers
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#title4"
                className="text-blue-500 hover:underline block lg:inline-block lg:mb-2"
              >
                Purchase Orders
              </a>
            </li>
          </ul>
        </div>
        <div className="ml-0 lg:ml-56 p-6 w-full overflow-y-auto">
          <>
            <>
              <TitleSection
                id="title1"
                title="System Login"
                paragraph={`  
                  First User must login to the System. use below JSON as request body and create a POST request to this link <code>https://inventory-hub-se.vercel.app/api/system/users</code> 
                  <br /> <br /><code style="color:Tomato;">&emsp;{<br /> 
                &emsp;&emsp;"action": "login",<br /> 
                &emsp;&emsp;"username": "gvwems",<br /> 
                &emsp;&emsp;"password": "123456789"<br /> 
                &emsp;}</code>
                <br /><br />
                it will return a JSON Web Token(jwt) and it will be needed to communicate with other API endpoints, specially when create and update recodes.
                <br /><br /><b style="font-size:23px;">Authenticate The User</b><br />
                The return token only valid for 24 hours only and there is a endpoint to authenticate the token. 
                Create POST request and add the token to the body like below and send it to this link <code>https://inventory-hub-se.vercel.app/api/system/users/authenticate</code>
            
                <br /><br /><code style="color:Tomato;">&emsp;{<br />
                &emsp;&emsp;&emsp;"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NmRhYTU4<br />&emsp;&emsp;&emsp;&emsp;YmU1NDIxMzkxMzBj
                NDUwYyIsInVzZXJuYW1lIjoiZ3Z3ZW1zIiwiaWF0IjoxNzE4OT <br />&emsp;&emsp;&emsp;&emsp;Shi9yHhkEjYHPMQegJ2ABqX2DIHRw"
                <br />&emsp;}</code><br /><br />
                
                <b style="font-size:23px;">Get User by ID The User</b><br />
                create a GET request for this link like this and add user id at the end <br />
                <code>https://inventory-hub-se.vercel.app/api/system/users/666daa58be542139130c450c</code> 

                <br /><br /><b style="font-size:23px;">Register User</b><br />
                in User registration proper authentication not implemented yet. follow this link and add the JSON body like below and create POST request. 
                <br /><code>https://inventory-hub-se.vercel.app/api/system/users</code><br />

                <br /><code style="color:Tomato;">&emsp;{<br />
	                &emsp;&emsp;&emsp;"action": "register",<br />
		              &emsp;&emsp;&emsp;"username":"abcde",<br />
		              &emsp;&emsp;&emsp;"email":"abcde@gmail.com",<br />
		              &emsp;&emsp;&emsp;"password":"123456789" <br />
                  &emsp;&emsp;&emsp;"functions": [ <br />
                      &emsp;&emsp;&emsp;&emsp;"invoice-create",<br />
                      &emsp;&emsp;&emsp;&emsp;"invoice-update",<br />
                      &emsp;&emsp;&emsp;&emsp;"PurchaseOrder-create",<br />
                      &emsp;&emsp;&emsp;&emsp;"PurchaseOrder-update",<br />
                      &emsp;&emsp;&emsp;&emsp;"item-update",<br />
                      &emsp;&emsp;&emsp;&emsp;"Category-update",   <br />  
                      &emsp;&emsp;&emsp;&emsp;"Supplier-create",<br />
                      &emsp;&emsp;&emsp;&emsp;"Supplier-update"]<br />
	              <br />&emsp;}</code><br /><br />

                <br /><br /><b style="font-size:23px;">Update User</b><br />
                this can user in many ways in theory. mainly it used for update the system functions for user.but it may be able use update other fields as well but not properly tested yet. 
                for now lets update user functions. create post request and add the body like below and change the id in link that you want to update. 
                <code>https://inventory-hub-se.vercel.app/api/system/users/6674ee175fd1dd5bd7355db3</code>  

                <br /><br /><code style="color:Tomato;">&emsp;{<br />
                &emsp;&emsp;&emsp;"functions": [ <br />
                &emsp;&emsp;&emsp;&emsp;"invoice-create",<br />
                &emsp;&emsp;&emsp;&emsp;"invoice-update",<br />
                &emsp;&emsp;&emsp;&emsp;"PurchaseOrder-create",<br />
                &emsp;&emsp;&emsp;&emsp;"PurchaseOrder-update",<br />
                &emsp;&emsp;&emsp;&emsp;"item-update",<br />
                &emsp;&emsp;&emsp;&emsp;"Category-update",  <br />   
                &emsp;&emsp;&emsp;&emsp;"Supplier-create",<br />
                &emsp;&emsp;&emsp;&emsp;"Supplier-update","Supplier-delete"],<br />
                &emsp;&emsp;&emsp;"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NmRhYTU4...."<br />
                <br />&emsp;}</code><br /><br />
                
                <br /><br /><b style="font-size:23px;">System Functions</b><br />
                "ManageUser","ManageUserGroup","invoice-create","invoice-update","invoice-delete","InventoryTransaction-create",
                "InventoryTransaction-update","InventoryTransaction-delete","PurchaseOrder-create","PurchaseOrder-update","PurchaseOrder-delete",
                "item-create","item-update","item-delete","Category-create","Category-update","Category-delete","Supplier-create","Supplier-update","Supplier-delete",

            `}
                reference={title1Ref}
              />
              <TitleSection
                id="title2"
                title="Title 1"
                paragraph="Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices."
                reference={title2Ref}
              />
              <TitleSection
                id="title3"
                title="Title 1"
                paragraph="Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices."
                reference={title3Ref}
              />
              <TitleSection
                id="title4"
                title="Title 1"
                paragraph="Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices.
                Paragraph for Title 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna quis velit fermentum ultrices."
                reference={title4Ref}
              />
            </>
          </>
        </div>
      </div>
    </div>
  );
};

export default Endpoints;

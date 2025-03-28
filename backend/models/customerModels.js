import { EntitySchema } from "typeorm";

const Customer = new EntitySchema({
    name: "Customer",
    tableName: "customers",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            length: 255,
        },
        email: {
            type: "varchar",
            length: 255,
            unique: true,
        },
        phoneNumber: {
            type: "varchar",
            length: 255,
        },
    },
});

export default Customer;

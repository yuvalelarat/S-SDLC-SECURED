import { AppDataSource } from "../config/data-source.js";
import Client from "../models/clientModels.js";

export async function createClientService(clientData) {
    const { name, email, phoneNumber } = clientData;
    try {
        const clientRepository = AppDataSource.getRepository(Client);

        const existingClient = await clientRepository.findOne({ where: { email } });

        if (existingClient) {
            return { status: 400, message: "Client already exists" };
        }

        const newClient = clientRepository.create({
            name,
            email,
            phoneNumber,
        });

        await clientRepository.save(newClient);

        return { status: 201, message: "Client created successfully", client: newClient };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}

export async function getAllClientsService() {
    try {
        const clientRepository = AppDataSource.getRepository(Client);
        const clientsRaw = await clientRepository.find();

        const escapeHTML = (str) => {
            return str
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };

        const clients = clientsRaw.map(client => ({
            id: escapeHTML(client.id?.toString()),
            name: escapeHTML(client.name),
            email: escapeHTML(client.email),
            phoneNumber: escapeHTML(client.phoneNumber),
        }));

        return { status: 200, message: "Clients retrieved successfully", clients };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}
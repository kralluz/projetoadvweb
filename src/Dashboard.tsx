import { useEffect, useState } from "react";
import axios from "axios";

interface Contact {
  id: string;
  Name: string;
  Email: string;
}

const Dashboard: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        try {
          const response = await axios.get<{ data: Contact[] }>(
            "https://www.bigin.com/api/v2/contacts",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          setContacts(response.data.data);
        } catch (error) {
          console.error("Erro ao obter contatos:", error);
          alert("Falha ao obter contatos.");
        }
      } else {
        alert("Token de acesso não encontrado.");
      }
    };

    fetchContacts();
  }, []);

  return (
    <div>
      <h1>Contatos da Bigin</h1>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.Name} - {contact.Email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

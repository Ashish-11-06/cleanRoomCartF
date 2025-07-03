import React, { useEffect, useState } from "react";
import { Table, Typography, Tag, Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "../../API/BaseURL";

const { Title } = Typography;

const Quotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchQuotes();
        // eslint-disable-next-line
    }, []);

    const fetchQuotes = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/quote/get`);
            setQuotes(res.data.reverse()); // latest first
        } catch (error) {
            message.error("Failed to fetch quotes.");
        }
        setLoading(false);
    };

    const columns = [
        {
            title: "Full Name",
            dataIndex: "fullName",
            key: "fullName",
            render: text => <b>{text}</b>,
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        },
        {
            title: "Company",
            dataIndex: "companyName",
            key: "companyName",
            responsive: ["md"],
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: email => <a href={`mailto:${email}`}>{email}</a>,
            responsive: ["md"],
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            responsive: ["md"],
        },
        {
            title: "Product",
            dataIndex: "serviceInterested",
            key: "serviceInterested",
            render: product => <Tag color="blue">{product}</Tag>,
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
            ellipsis: true,
            width: 250,
            render: text => <span title={text}>{text.length > 60 ? text.slice(0, 60) + "..." : text}</span>,
        },
        {
            title: "Attachment",
            dataIndex: "attachment",
            key: "attachment",
            render: (attachment) =>
                attachment ? (
                    <a
                        href={`${BASE_URL}/uploads/${attachment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                    >
                        <Button icon={<DownloadOutlined />} size="small">
                            PDF
                        </Button>
                    </a>
                ) : (
                    <Tag color="default">No PDF</Tag>
                ),
            align: "center",
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: date => new Date(date).toLocaleString(),
            sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            defaultSortOrder: "descend",
            responsive: ["lg"],
        },
    ];

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>All Quotes</Title>
            <Table
                columns={columns}
                dataSource={quotes.map(q => ({ ...q, key: q._id }))}
                loading={loading}
                bordered
                pagination={{ pageSize: 10, showSizeChanger: true }}
                scroll={{ x: "max-content" }}
                rowClassName={() => "ant-table-row"}
            />
        </div>
    );
};

export default Quotes;

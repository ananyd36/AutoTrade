import { createMcpHandler } from "@vercel/mcp-adapter";
import z from "zod";

const handler = createMcpHandler(
    server => {
        server.tool(
            "Buy_Stock",
            "Buy a stock at market price on Zerodha",
            {
                tradingExperience: z.enum(["beginner", "intermediate"]),
                
            },
            ({tradingExperience}) =>  ({
                content: [
                    {
                    type: "text",
                    text: `I recommend you to buy ${
                        tradingExperience === "beginner" ? "100 stocks" : "500 stocks"
                    }`
            }]
        })
        );
    },
    {
    capabilities: {
        tools:{
            "Buy_Stock": {
                description: "Buy a stock at market price on Zerodha",
        },
    },

}, 
    },
{
    redisUrl: process.env.REDIS_URL,
    sseEndpoint: "/sse",
    streamableHttpEndpoint: "/mcp",
    verboseLogs: true,
    maxDuration: 60,
});

export { handler as GET, handler as POST , handler as DELETE };
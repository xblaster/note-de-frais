import { Injectable, Logger } from '@nestjs/common';
import ollama from 'ollama';
import { readFileSync } from 'fs';
import { parse, format, isValid } from 'date-fns';

// 1. Define a TypeScript interface for type safety
interface Expense {
    vendor: string | null;
    amount: number | null;
    date: string | null;
}

@Injectable()
export class OllamaService {
    private readonly logger = new Logger(OllamaService.name);
    private readonly model = 'qwen3-vl:2b'; // User requested "qwen3-vl" (adjusted to valid model name)

    async analyzeReceipt(filePath: string): Promise<Expense> {
        try {
            this.logger.log(`Analyzing receipt: ${filePath} with model ${this.model}`);

            const imageBuffer = readFileSync(filePath);
            const base64Image = imageBuffer.toString('base64');

            // 2. Define the JSON Schema manually (this replaces zodToJsonSchema)
            // This is the exact format Ollama expects for structured outputs.
            const jsonSchema = {
                type: 'object',
                properties: {
                    vendor: {
                        type: ['string', 'null'],
                        description: 'The name of the store or service provider.',
                    },
                    amount: {
                        type: ['number', 'null'],
                        description: 'The total amount paid (number only, no currency symbol).',
                    },
                    date: {
                        type: ['string', 'null'],
                        description: 'The date of the transaction (e.g., DD/MM/YYYY, MM/DD/YY, YYYY-MM-DD, etc.).',
                    },
                },
                required: ['vendor', 'amount', 'date'],
            };

            this.logger.log(`Sending request to Ollama with schema: ${JSON.stringify(jsonSchema, null, 2)}`);

            const response = await ollama.chat({
                model: this.model,
                messages: [{
                    role: 'user',
                    content: 'Analyze this receipt image and extract the vendor, amount, and date.',
                    images: [base64Image],
                }],
                format: jsonSchema, // Pass the manual schema directly
                options: {
                    temperature: 0, // Deterministic output
                },
            });

            console.log("DEBUG RAW RESPONSE:", response.message.content);
            this.logger.log(`Ollama response content: ${response.message.content}`);

            // 3. Parse the JSON response
            // Since we requested structured output, we can trust Ollama to return valid JSON matching the schema.
            const parsedData = JSON.parse(response.message.content) as Expense;

            return {
                vendor: parsedData.vendor,
                amount: parsedData.amount,
                date: this.normalizeDate(parsedData.date),
            };

        } catch (error) {
            this.logger.error('Error during receipt analysis', error);
            if (error instanceof Error) {
                this.logger.error(`Error message: ${error.message}`);
                this.logger.error(`Error stack: ${error.stack}`);
                if ('cause' in error) {
                    this.logger.error(`Error cause: ${JSON.stringify((error as any).cause, null, 2)}`);
                }
            }
            this.logger.error(`Full error object: ${JSON.stringify(error, null, 2)}`);
            throw error;
        }
    }

    /**
     * Attempts to normalize inconsistent date formats into YYYY-MM-DD using date-fns.
     */
    private normalizeDate(dateStr: string | null): string | null {
        if (!dateStr) return null;

        const cleanDate = dateStr.trim();
        const referenceDate = new Date();

        // Common formats to try, ordered by likelihood
        const formatsToTry = [
            'yyyy-MM-dd',
            'dd/MM/yyyy',
            'dd.MM.yyyy',
            'dd-MM-yyyy',
            'yyyy/MM/dd',
            'MM/dd/yyyy',
            'dd/MM/yy',
            'dd.MM.yy',
            'dd-MM-yy',
            'yy-MM-dd',
        ];

        for (const fmt of formatsToTry) {
            try {
                const parsedDate = parse(cleanDate, fmt, referenceDate);
                // Check if the parsed date is valid and the format matches the length approximately
                // date-fns parse can be very aggressive (e.g. parsing '05-02-26' as year 0005 with 'dd-MM-yyyy')
                if (isValid(parsedDate) && parsedDate.getFullYear() > 1000) {
                    return format(parsedDate, 'yyyy-MM-dd');
                }
            } catch (e) {
                // Continue to next format
            }
        }

        // Try one more time specifically for short years if still failing
        const shortYearFormats = ['dd/MM/yy', 'dd.MM.yy', 'dd-MM-yy', 'yy-MM-dd'];
        for (const fmt of shortYearFormats) {
            try {
                const parsedDate = parse(cleanDate, fmt, referenceDate);
                if (isValid(parsedDate)) {
                    return format(parsedDate, 'yyyy-MM-dd');
                }
            } catch (e) { }
        }

        // Final fallback to native Date parsing
        try {
            const d = new Date(cleanDate);
            if (!isNaN(d.getTime())) {
                return format(d, 'yyyy-MM-dd');
            }
        } catch (e) {
            // Keep original if everything fails
        }

        return dateStr;
    }

    async isHealthy(): Promise<boolean> {
        try {
            await ollama.list();
            return true;
        } catch (e) {
            return false;
        }
    }
}
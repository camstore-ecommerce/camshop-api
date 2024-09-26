interface Address {
    name: string;
    address: string;
}

export class SendMailDto {
    sender?: Address;
    recipients: Address[];
    subject: string;
    html?: string;
    text?: string;
}
export interface iPetsResult {
    total:   number;
    pages:   number;
    size:    number;
    offset:  number;
    count:   number;
    results: iPet[];
}

export interface iPet {
    _id:       string;
    petId:     string;
    petUUID:   string;
    domain:    Domain;
    petURI:    string;
    imgs:      string[];
    status:    Status;
    createdAt: string;
    updatedAt: string;
    __v:       number;
    age:       Age;
    breed:     string;
    name:      string;
    sex:       Sex;
}

export enum Age {
    Adult = "Adult",
    Baby = "Baby",
    Empty = "",
    Senior = "Senior",
    The3YearsAnd1Months = "3 years and 1 months",
    Young = "Young",
}

export enum Domain {
    AarfhoustonOrg = "aarfhouston.org",
    HoustonspcaOrg = "houstonspca.org",
}

export enum Sex {
    Empty = "",
    FemaleSpayed = "Female (spayed)",
    Male = "Male",
    MaleNeutered = "Male (neutered)",
}

export enum Status {
    Active = "Active",
    Inactive = "Inactive",
}

import { NextFunction, Request, Response } from 'express';

export async function getAllInterviews(req: Request, res: Response, next: NextFunction) {
    res.send("Get all Interviews here");
}

export async function getInterview(req: Request, res: Response, next: NextFunction) {
    res.send("Get Interview here");
}

export async function createInterview(req: Request, res: Response, next: NextFunction) {
    res.send("Create Interview here");
}

export async function updateInterview(req: Request, res: Response, next: NextFunction) {
    res.send("Update Interview here");
}

export async function deleteInterview(req: Request, res: Response, next: NextFunction) {
    res.send("Delete Interview here");
}

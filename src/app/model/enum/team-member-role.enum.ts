export enum TeamMemberRole {
    ChiefFinancialPlanner = 0,
    SeniorParaPlanner = 1,
    ParaPlanner = 2,
    OperationalRelationshipManager = 3,
    SalesRelationshipManager = 4,
    ResearchRelationshipManager = 5

}

export class TeamMemberRoleUtils {
    public static getTeamMemberRoleText(role) {
        switch (role) {
            case TeamMemberRole.ChiefFinancialPlanner: return 'Chief Financial Planner';
            case TeamMemberRole.ParaPlanner: return 'Para Planner';
            case TeamMemberRole.OperationalRelationshipManager: return 'Operational RM';
            case TeamMemberRole.SalesRelationshipManager: return 'Sales RM';
            case TeamMemberRole.ResearchRelationshipManager: return 'Research RM';
            case TeamMemberRole.SeniorParaPlanner: return 'Senior Para Planner';
        }
    }

    public static getTeamMemberRoleArray() {
        const teamMemberRole = [
            {
                key: TeamMemberRole.SeniorParaPlanner,
                value: this.getTeamMemberRoleText(TeamMemberRole.SeniorParaPlanner)
            },
            {
                key: TeamMemberRole.ParaPlanner,
                value: this.getTeamMemberRoleText(TeamMemberRole.ParaPlanner)
            },
            {
                key: TeamMemberRole.OperationalRelationshipManager,
                value: this.getTeamMemberRoleText(TeamMemberRole.OperationalRelationshipManager)
            },
            {
                key: TeamMemberRole.SalesRelationshipManager,
                value: this.getTeamMemberRoleText(TeamMemberRole.SalesRelationshipManager)
            },
            {
                key: TeamMemberRole.ResearchRelationshipManager,
                value: this.getTeamMemberRoleText(TeamMemberRole.ResearchRelationshipManager)
            }
        ];
        return teamMemberRole;
    }
}

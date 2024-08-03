from commands.command import Command
from scripts.extractor import process_repack
from scripts.car_analysis import CarAnalysisUtils
import json

class FitPartsCommand(Command):
    def __init__(self, message, client):
        super().__init__(message, client)

    async def execute(self):
        car_analysis = CarAnalysisUtils(self.client)
        car_analysis.fit_latest_designs_all_grid(Command.is_create_a_team)
        process_repack("../result", Command.path)
        info = []
        info.insert(0, f"Succesfully fitted all teams with their latets designs")
        info_json = json.dumps(info)
        await self.send_message_to_client(info_json)
        design_dict = car_analysis.get_parts_from_team(self.message["teamID"])
        parts_stats = ["Parts stats fetched", car_analysis.get_unitvalue_from_parts(design_dict), car_analysis.get_all_parts_from_team(self.message["teamID"])]
        data_json = json.dumps(parts_stats)
        await self.send_message_to_client(data_json)
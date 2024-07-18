import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Todo } from 'src/entity/Todo';
import { CreateTodoDto } from './dto/create-todo.dto';
import { EditTodoDto } from './dto/edit-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepositort: Repository<Todo>,
  ) {}

  findAll(): Promise<Todo[]> {
    return this.todoRepositort.find();
  }

  findOne(id: number): Promise<Todo | null> {
    try {
      return this.todoRepositort.findOne({
        where: {
          id: id
        }
      });
    } catch (error) {
      throw new HttpException('Not found item', HttpStatus.BAD_REQUEST)
    }    
  }

  edit(editTodoDto: EditTodoDto): Promise<UpdateResult> {
    return this.todoRepositort.update(editTodoDto.id, {
      title: editTodoDto.title,
      done: editTodoDto.done
    });
    // executes UPDATE user SET title = ... WHERE id = editTodoDto.id
  }

  create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const newItem = new Todo();

    newItem.title = createTodoDto.title;

    return this.todoRepositort.save(newItem);
  }

  remove(id: number): Promise<void> {
    try {
      this.todoRepositort.delete({ id });      
      return;
    } catch (error) {
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    }    
  }
}
